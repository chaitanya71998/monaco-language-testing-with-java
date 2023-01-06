/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
// import * as path from "path";
import {
    IWebSocket,
    WebSocketMessageReader,
    WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import * as server from "vscode-ws-jsonrpc/server";
import * as lsp from "vscode-languageserver";
import { Message } from "vscode-languageserver";
import pathModule from "path";
const currentPath = process.cwd();
const jdtPath = pathModule.join(currentPath, "../server/jspServer");
export function launch(socket: IWebSocket) {
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);

    const socketConnection = server.createConnection(reader, writer, () =>
        socket.dispose()
    );

    const args = [
        "-Declipse.application=org.eclipse.jdt.ls.core.id1",
        "-Dosgi.bundles.defaultStartLevel=4",
        "-Declipse.product=org.eclipse.jdt.ls.core.product",
        "-Dlog.level=ALL",
        "-noverify",
        "-Xmx1G",
        "-jar",
        `${jdtPath}/jdt-language-server-1.9.0-202203031534/plugins/org.eclipse.equinox.launcher_1.6.400.v20210924-0641.jar`,
        "-configuration",
        `${jdtPath}/jdt-language-server-1.9.0-202203031534/config_linux`,
        "-data",
        `${jdtPath}`,
        "--add-modules=ALL-SYSTEM",
        "--add-opens java.base/java.util=ALL-UNNAMED",
        "--add-opens java.base/java.lang=ALL-UNNAMED",
    ];
    const serverConnection = server.createServerProcess("JAVA", "java", args);
    if (serverConnection) {
        server.forward(socketConnection, serverConnection, (message) => {
            if (Message.isRequest(message)) {
                if (message.method === lsp.InitializeRequest.type.method) {
                    const initializeParams =
                        message.params as lsp.InitializeParams;
                    initializeParams.processId = process.pid;
                }
            }
            return message;
        });
    }
}

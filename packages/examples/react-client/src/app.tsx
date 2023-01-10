import React, { useEffect, useState } from "react";

import * as monaco from "monaco-editor";
import Editor, { loader } from "@monaco-editor/react";

import "monaco-editor/esm/vs/editor/editor.all.js";

import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";

import {
    CloseAction,
    ErrorAction,
    MonacoLanguageClient,
    MonacoServices,
} from "monaco-languageclient";
import normalizeUrl from "normalize-url";
import {
    WebSocketMessageReader,
    WebSocketMessageWriter,
    toSocket,
} from "vscode-ws-jsonrpc";

loader.config({ monaco });

export function createUrl(
    hostname: string,
    port: string,
    path: string
): string {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
}

function createLanguageClient(transports: any) {
    return new MonacoLanguageClient({
        name: "Java Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ["java"],
            // disable the default error handler
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.DoNotRestart }),
            },
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports);
            },
        },
    });
}

function createWebSocket(url: string) {
    const webSocket = new WebSocket(url);
    webSocket.onopen = () => {
        const socket = toSocket(webSocket);
        const reader = new WebSocketMessageReader(socket)
        const writer = new WebSocketMessageWriter(socket);
        const languageClient = createLanguageClient({
            reader,
            writer,
        });
        languageClient.start();
        reader.onClose(() => languageClient.stop());
    };
}

interface Props {
    filePath:string
}

const MonacoEditor = ({filePath}:Props) => {
    const hostname = "localhost";
    const urlPath = "";
    const port = "4000";
    const [code, setCode] = useState("");
    const onMount = (editor, monacoInstance) => {
        monacoInstance.languages.register({
            id: "java",
            extensions: [".java"],
            aliases: ["JAVA", "java"],
            mimetypes: ["application/text"],
        });
        MonacoServices.install();
    };

    useEffect(() => {
        const url = createUrl(hostname, port, urlPath);
        createWebSocket(url);
    }, []);
    const editorCustomOptions = {
        glyphMargin: true,
        lightbulb: {
            enabled: true,
        },
    };

    //update file path you file editor
    return (
        <Editor
            path={
              filePath
            }
            height="50vh"
            value={code}
            onChange={(newCode) => {
                if (newCode) {
                    setCode(newCode);
                }
            }}
            options={editorCustomOptions}
            loading={"Loading..."}
            keepCurrentModel={true}
            theme="vs-dark"
            onMount={onMount}
        />
    );
};

export default MonacoEditor;

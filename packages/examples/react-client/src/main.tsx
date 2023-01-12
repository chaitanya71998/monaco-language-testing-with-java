/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import React from "react"
import ReactDOM from "react-dom/client"
import ReactMonacoEditor from "./app.js"

const defaultCode = `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}`

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
  <ReactMonacoEditor filePath="file:///app/java-spring-boot-initial-code/src/main/java/com/jetbrains/marco/photoz/clone/PhotozCloneApplication.java" />
)

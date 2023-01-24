/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import React from "react"
import ReactDOM from "react-dom/client"
import ReactMonacoEditor from "./app.js"

const defaultCode = `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}`

const root = ReactDOM.createRoot(document.getElementById("root")!)
// filepath should be server system file path
root.render(
  <ReactMonacoEditor filePath="file:///home/chaitanya/Documents/clonning_folders/testing-java-langauge-client/monaco-language-testing-with-java/packages/examples/react-client/src/HelloWorld.java" />
)

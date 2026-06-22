import { theme } from "@/theme";
import {
  CoreBridge,
  RichText as TenTapRichText,
  TenTapStartKit,
  Toolbar,
  darkEditorTheme,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import React, { useEffect, useRef } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { InputStyles } from "./InputStyles";

// O TenTap representa um editor vazio como "<p></p>" — normalizamos para "".
const EMPTY_HTML_VALUES = ["", "<p></p>", "<p><br></p>"];

const DEFAULT_BACKGROUND = "rgb(27, 27, 27)";

// A cor do texto do documento é controlada por CSS injetado no WebView
// (o `theme` do TenTap só estiliza o lado RN — toolbar/container).
function buildEditorCss(backgroundColor: string): string {
  return `
  * {
    color: #FFFFFF;
    background-color: ${backgroundColor};
    padding-left: 2px;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    color: rgb(150, 150, 150);
  }
`;
}

function normalizeHtml(html: string): string {
  return EMPTY_HTML_VALUES.includes(html.trim()) ? "" : html;
}

type Props = {
  name: string;
  control: any;
  rules?: RegisterOptions;
  label?: string;
  placeholder?: string;
  error?: string | null;
  editable?: boolean;
  /** Altura mínima da área de edição (default 140). */
  minHeight?: number;
  icon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
};

type FieldProps = {
  value?: string;
  onChange: (html: string) => void;
  editable: boolean;
  minHeight: number;
  error?: string | null;
};

function RichTextField({
  value,
  onChange,
  editable,
  minHeight,
  error,
}: FieldProps) {
  const editor = useEditorBridge({
    initialContent: value || "",
    editable,
    autofocus: false,
    avoidIosKeyboard: true,
    dynamicHeight: true,
    theme: darkEditorTheme,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(buildEditorCss(DEFAULT_BACKGROUND)),
    ],
  });

  const content = useEditorContent(editor, { type: "html" });
  const lastEmitted = useRef(normalizeHtml(value ?? ""));

  useEffect(() => {
    if (content === undefined) return;
    const normalized = normalizeHtml(content);
    if (normalized === lastEmitted.current) return;
    lastEmitted.current = normalized;
    onChange(normalized);
  }, [content, onChange]);

  return (
    <View>
      <View
        style={[
          styles.editorContainer,
          { minHeight },
          error ? styles.editorError : null,
        ]}
      >
        <TenTapRichText editor={editor} style={[styles.editor, { minHeight }]} />
      </View>

      {editable ? <Toolbar editor={editor} /> : null}
    </View>
  );
}

export function InputRichText({
  name,
  control,
  rules,
  label,
  error,
  editable = true,
  minHeight = 140,
  icon,
  style,
}: Props) {
  return (
    <InputStyles label={label} error={error ?? ""} icon={icon} style={style}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <RichTextField
            value={value}
            onChange={onChange}
            editable={editable}
            minHeight={minHeight}
            error={error}
          />
        )}
      />
    </InputStyles>
  );
}

type RichTextViewerProps = {
  /** HTML a renderizar (modo leitura, sem toolbar). */
  html: string;
  minHeight?: number;
  /** Cor de fundo do conteúdo (para casar com o balão do chat). */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Renderizador read-only de HTML (reusa o núcleo do Input.RichText, sem RHF
 * nem toolbar). Usado, por exemplo, em balões de chat com conteúdo formatado.
 */
export function RichTextViewer({
  html,
  minHeight,
  backgroundColor = DEFAULT_BACKGROUND,
  style,
}: RichTextViewerProps) {
  const editor = useEditorBridge({
    initialContent: html || "",
    editable: false,
    autofocus: false,
    dynamicHeight: true,
    theme: darkEditorTheme,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(buildEditorCss(backgroundColor)),
    ],
  });

  return (
    <TenTapRichText
      editor={editor}
      style={[{ backgroundColor }, minHeight ? { minHeight } : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  editorContainer: {
    borderRadius: 5,
    borderColor: "rgb(59, 59, 59)",
    backgroundColor: DEFAULT_BACKGROUND,
    borderWidth: 1,
    overflow: "hidden",
  },
  editorError: {
    borderColor: theme.border.danger,
  },
  editor: {
    backgroundColor: DEFAULT_BACKGROUND,
  },
});

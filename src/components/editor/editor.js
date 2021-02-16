import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";
import "./code-mirror.css";
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import { Controlled as CodeMirror } from "react-codemirror2";
import { AppContext } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  editor: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  codeContainer: {
    flexGrow: 1,
    overflow: "hidden",
  },
  code: {
    height: "100%",
    overflow: "hidden",
  },
}));

export default function Editor(props) {
  const classes = useStyles();

  const [editor, setEditor] = useState(null);

  const { user } = useContext(AppContext);

  const {
    title,
    mode,
    value,
    setValue,
    setCursor,
    cursors,
    changeRange,
    ranges,
  } = props;

  useEffect(() => {
    const currentCursors = document.getElementsByClassName(
      "custom-cursors-" + mode
    );
    while (currentCursors.length > 0) {
      currentCursors[0].parentNode.removeChild(currentCursors[0]);
    }
    cursors &&
      editor &&
      Object.values(cursors).forEach((cursor) => {
        if (cursor.user !== user.id) {
          const cursorElement = document.createElement("div");
          cursorElement.className = "custom-cursors-" + mode;

          const cursorElementSpan = document.createElement("span");
          cursorElementSpan.className = "cursor";
          cursorElementSpan.style.borderLeftColor = cursor.color;

          const cursorElementTriangle = document.createElement("div");
          cursorElementTriangle.className = "triangle";
          cursorElementTriangle.style.borderBottomColor = cursor.color;

          cursorElement.appendChild(cursorElementSpan);
          cursorElement.appendChild(cursorElementTriangle);

          editor.setBookmark(
            { line: cursor.line, ch: cursor.ch },
            { widget: cursorElement }
          );
        }
      });
  }, [cursors, editor]);

  useEffect(() => {
    if (editor) {
      const marks = editor.getAllMarks();
      marks.forEach((mark) => {
        mark.type === "range" && mark.clear();
      });
    }
    ranges &&
      editor &&
      Object.values(ranges).forEach((range) => {
        if (range.user !== user.id) {
          editor.markText(
            { line: range.from.line, ch: range.from.ch },
            { line: range.to.line, ch: range.to.ch },
            { css: `background-color: rgba(${hexToRgb(range.color)}, .3)` }
          );
        }
      });
  }, [ranges, editor]);

  return (
    <Card className={classes.editor}>
      <CardHeader title={title} />
      <Divider />
      <div className={classes.codeContainer}>
        <CodeMirror
          className={classes.code}
          value={value}
          options={{
            mode,
            theme: "monokai",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
          onChange={(editor, data, value) => {}}
          onCursor={(editor, data) => {
            setCursor({
              line: data.line,
              ch: data.ch,
            });
          }}
          editorDidMount={(editor) => {
            setEditor(editor);
          }}
          onSelection={(editor, data) => {
            const range = data.ranges[0];
            changeRange({
              from: {
                line: range.anchor.line,
                ch: range.anchor.ch,
              },
              to: {
                line: range.head.line,
                ch: range.head.ch,
              },
            });
          }}
        />
      </div>
    </Card>
  );
}

function hexToRgb(hex) {
  const h = hex.slice(1);
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return r + "," + g + "," + b;
}

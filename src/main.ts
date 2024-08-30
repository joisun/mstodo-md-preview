import { behindDebounce } from "./debounce";
import { waitForElement } from "./getElement";
import markdownit from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.min.css";
import "./style.css";
// import 'github-markdown-css/github-markdown-dark.css'
import { createBtnWithIcon } from "./utils";
const md = markdownit({
  // Enable HTML tags in source
  html: false,
  // Use '/' to close single tags (<br />)
  xhtmlOut: false,
  // Convert '\n' in paragraphs into <br>
  breaks: false,
  // CSS language prefix for fenced blocks
  langPrefix: "language-",
  // autoconvert URL-like texts to links
  linkify: true,
  // Enable smartypants and other sweet transforms
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  },
});

const EDIT_BTN_ID = "mstodo:editBtn";
const VIEW_BTN_ID = "mstodo:viewBtn";
// 使用方法
waitForElement(".ql-editor").then(() => {
  // 初次解析 md 文本
  observerHandler();
  hideEditor();
  // 启用观察器以抉择何时重新解析markdown 内容
  observe();
  // click task item listener
  clickListen();
});
let isEdit = false;
function hideEditor() {
  if (isEdit) return;
  const editor = document.querySelector(".ql-editor") as HTMLDivElement;
  editor && (editor.style.height = "0px");
  const viewer = document.getElementById("tstodo:mdViewer");
  viewer && (viewer.style.height = "auto");
}
function showEditor() {
  isEdit = true;
  const editor = document.querySelector(".ql-editor") as HTMLDivElement;
  editor && (editor.style.height = "auto");
  const viewer = document.getElementById("tstodo:mdViewer");
  viewer && (viewer.style.height = "0px");
}

// 初始化切换按钮
const initBtns = () => {
  if (document.getElementById("mstodo:btns")) return;
  const detailNote = document.querySelector(".detailNote") as HTMLDivElement;
  if (!detailNote) return;

  const edit = createBtnWithIcon(
    EDIT_BTN_ID,
    `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V10.4q0 .275-.162.475t-.413.3q-.4.15-.763.388T18 12.1l-5.4 5.4q-.275.275-.437.638T12 18.9V21q0 .425-.288.713T11 22zm8-1v-1.65q0-.2.075-.387t.225-.338l5.225-5.2q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55t-.1.563t-.325.512l-5.2 5.2q-.15.15-.337.225T16.65 22H15q-.425 0-.712-.287T14 21m6.575-4.6l.925-.975l-.925-.925l-.95.95zM14 9h4l-5-5l5 5l-5-5v4q0 .425.288.713T14 9"/></svg>`
  );
  const view = createBtnWithIcon(
    VIEW_BTN_ID,
    `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4zM790.2 326L602 137.8V326zM426.13 600.93l59.11 132.97a16 16 0 0 0 14.62 9.5h24.06a16 16 0 0 0 14.63-9.51l59.1-133.35V758a16 16 0 0 0 16.01 16H641a16 16 0 0 0 16-16V486a16 16 0 0 0-16-16h-34.75a16 16 0 0 0-14.67 9.62L512.1 662.2l-79.48-182.59a16 16 0 0 0-14.67-9.61H383a16 16 0 0 0-16 16v272a16 16 0 0 0 16 16h27.13a16 16 0 0 0 16-16z"/></svg>`
  );
  const btns = document.createElement("div");
  btns.id = "mstodo:btns";
  btns.style.display = "flex";
  btns.style.gap = ".5em";
  btns.style.justifyContent = "flex-end";
  btns.style.padding = "0.5em 1em";

  btns.appendChild(edit);
  btns.appendChild(view);
  detailNote.parentElement &&
    detailNote.parentElement?.insertBefore(btns, detailNote);
  edit.addEventListener("click", () => {
    showEditor();
  });
  view.addEventListener("click", () => {
    isEdit = false;
    hideEditor();
  });
};

// 初始化 md 转换文本接收容器
const createContainer = (qlEditor: HTMLDivElement) => {
  if (!qlEditor) return;

  const container = document.createElement("div");
  container.id = "tstodo:mdViewer";
  container.classList.add("markdown-body");
  (container as any).style = `
    overflow: hidden;
    background-color: inherit;
  `;
  container.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
  });
  qlEditor.parentElement &&
    qlEditor.parentElement?.insertBefore(container, qlEditor);
  return container;
};

//  当页面变化的时候，重新解析 md 的handler
const observerHandler = behindDebounce(function () {
  // 初始化容器
  const qlEditor = document.querySelector(".ql-editor") as HTMLDivElement;
  console.log("mstodo:editor existed: ", !!qlEditor);

  const mdViewer =
    document.getElementById("tstodo:mdViewer") ||
    (createContainer(qlEditor) as HTMLDivElement);

  console.log("mstodo:mdviewer existed: ", !!mdViewer);

  // 初始化切换按钮
  initBtns();
  if (!qlEditor) return;
  const mdContent = qlEditor.innerText;
  try {
    console.log("mstodo:parsing....");
    let result = md.render(mdContent);
    mdViewer.innerHTML = result;

    if (!isEdit) hideEditor();
  } catch (err) {
    console.error(err);
  }
}, 100);

const observer = new MutationObserver(observerHandler);
function disconnect() {
  observer.disconnect();
}
// 观察器， 当相关元素变化可能触发markdown变化的时候需要重新解析
function observe() {
  disconnect();
  // observer.observe(document.querySelector(".rightColumn")!, {
  //   subtree: false,
  //   childList: false,
  //   attributes: true,
  // });
  // observer.observe(document.querySelector(".details")!, {
  //   subtree: false,
  //   childList: false,
  //   attributes: true,
  // });
  // 内容变化
  observer.observe(document.querySelector(".ql-editor")!, {
    characterData: true, // 观察目标节点内文本内容的变化
    childList: true,     // 观察目标节点中直接子节点的增删
    subtree: true,       // 观察所有后代节点
    characterDataOldValue: true // 记录文本内容的变化前信息
  });
}

function clickListen() {
  document.addEventListener("click", function (e) {
    const target = e.target as HTMLButtonElement;
    const parent = document.querySelector('.tasks') || document.querySelector('.grid-body')
    if (target.className === "taskItem-titleWrapper" || parent?.contains(target)) {
      console.log("mstodo: click listener triggered")
      observerHandler();
    }
  });
}

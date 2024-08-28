export const createBtnWithIcon = function (id: string, icon: string) {
  const btn = document.createElement("button");

  btn.id = id;
  btn.innerHTML = icon;
  btn.style.width = "auto";
  btn.style.height = "auto";
  btn.style.color = "inherit";
  btn.style.padding = ".2em .5em";

  // 设置按钮的基本样式
  btn.style.backgroundColor = "#555"; // 近似于 OpenAI 绿色
  btn.style.border = "none";
  btn.style.borderRadius = "4px"; // 圆形按钮
  btn.style.display = "inline-flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.transition = "background-color 0.3s ease";

  // 添加悬停样式
  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = "#444"; // 悬停时略微深色
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = "#555"; // 返回原色
  });

  return btn;
};

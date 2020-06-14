export const b64DecodeUnicode = (value: string) =>
  decodeURIComponent(
    atob(value)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

// 前置补零
export const pad = (num: number) => (Array(2).join("0") + ~~num).slice(-2);

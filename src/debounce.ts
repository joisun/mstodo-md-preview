export function behindDebounce(func: Function, duration: number) {
    let timer: number | null = null;
    return () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, duration);
    };
  }
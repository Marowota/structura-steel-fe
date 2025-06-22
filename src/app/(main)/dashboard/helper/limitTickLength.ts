export const limitTickLength = (tick: string, maxLength: number): string[] => {
  return tick.split(" ").reduce(
    (acc, current) => {
      const currentText = acc.result[acc.result.length - 1];
      const textSpace = currentText ? 1 : 0;
      if (acc.currentLength + current.length + textSpace <= maxLength) {
        acc.currentLength += current.length + 1;
        acc.result[acc.result.length - 1] +=
          `${textSpace ? " " : ""}${current}`;
      } else {
        acc.result.push(current);
        acc.currentLength = current.length;
      }
      return acc;
    },
    {
      currentLength: 0,
      result: [""],
    },
  ).result;
};

export type ComponentName = "hint" | "console";
export type CSS = Record<string, string>;

type Styles = Partial<Record<ComponentName, CSS>>;

export default Styles;

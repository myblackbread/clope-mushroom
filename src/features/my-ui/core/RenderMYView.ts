import { MYView } from "./View";

export const RenderMYView: React.FC<{ view: MYView }> = ({ view }) => {
  return view.makeView();
};
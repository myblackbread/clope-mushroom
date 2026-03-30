import { MYView } from "../core/View";

export const RenderMYView: React.FC<{ view: MYView }> = ({ view }) => {
  return view.makeView();
};
import { MYView, MYVStack, MYButton, MYColor, MYCapsule, MYBinding, MYFrame } from "@/src/features/my-ui";

export class ExpandablePanel extends MYView {
    constructor(
        private readonly isExpanded: MYBinding<boolean>, 
        private readonly content: MYView
    ) { 
        super(); 
    }

    body(frame?: MYFrame): MYView {
        const isExpanded = this.isExpanded.wrappedValue;
        
        return new MYVStack([
            new MYButton(
                () => this.isExpanded.wrappedValue = !isExpanded,
                MYColor.rgb(209, 213, 219)
                    .frame({
                        width: isExpanded ? 40 : 60,
                        height: isExpanded ? 5 : 8
                    })
                    .animation()
            )
            .clipShape(new MYCapsule()),
            
            isExpanded && this.content
        ], 8);
    }
}
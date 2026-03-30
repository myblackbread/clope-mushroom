import MY from "@/src/shared/my-ui";

export class ExpandablePanel extends MY.View {
    constructor(
        private readonly isExpanded: MY.Binding<boolean>, 
        private readonly content: MY.View
    ) { 
        super(); 
    }

    body(): MY.View {
        const isExpanded = this.isExpanded.wrappedValue;
        
        return new MY.VStack([
            new MY.Button(
                () => this.isExpanded.wrappedValue = !isExpanded,
                MY.Color.rgb(209, 213, 219)
                    .frame({
                        width: isExpanded ? 40 : 60,
                        height: isExpanded ? 5 : 8
                    })
                    .animation()
            )
            .clipShape(new MY.Capsule()),
            
            isExpanded && this.content
        ], 8);
    }
}
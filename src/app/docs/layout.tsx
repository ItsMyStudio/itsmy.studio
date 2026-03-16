import { source } from '@/lib/source';
import { DocsLayout } from '@/components/layout/docs';
import { baseOptions, DiscordIcon } from '@/lib/layout.shared';
import { getSection } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const options = baseOptions();

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...options}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
      links={[]}
    >
      {children}
    </DocsLayout>
  );
}

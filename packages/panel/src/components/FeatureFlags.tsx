import Header from "./Header";
import Section from "./Section";
import List from "./List";
import ListItem from "./ListItem";
import Link from "./Link";

export type FeatureFlagsData = Record<
  string,
  {
    value: any;
    evaluation: {
      reason: string;
      condition_index: number;
    };
  }
>;

const FeatureFlags: React.FC<{
  featureFlags: FeatureFlagsData | undefined;
}> = ({ featureFlags }) => {
  return (
    <Section>
      <Header>Feature flags</Header>
      {featureFlags ? (
        <List>
          {Object.entries(featureFlags)
            .slice(0, 5)
            .map(([key, value]) => {
              return (
                <ListItem flag>
                  <Link to="#" flag external>
                    {key}
                  </Link>
                </ListItem>
              );
            })}
        </List>
      ) : null}
    </Section>
  );
};

export default FeatureFlags;

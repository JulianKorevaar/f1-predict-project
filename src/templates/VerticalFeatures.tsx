import { VerticalFeatureRow } from '../components/feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Section
    title="Hoe werkt het?"
    description="Er worden punten toegekend aan de eerste top 3 tijdens de kwalificatie en de race."
  >
    <VerticalFeatureRow
      title="1"
      description="Om mee te doen is het van belang dat je je naam opgeeft, zodat je aan het spel kan toegevoegd worden."
      image="/assets/images/f1_car.gif"
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="2"
      description="Per race worden er punten toegekend aan de top 3 voor de kwalificatie en de race uitslag en eventueel een bonus vraag. Voor de kwalificatie en de race krijg je 3 punten per goede voorspelling. Als je de bonus vraag goed beantwoord krijg je 7 punten. Per GP weekend kan je dus 25 punten verdienen."
      image="/assets/images/counting.gif"
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="3"
      description="Uiteindelijk degene die bovenaan het scoreboord zal de meestervoorspeller zijn van het F1 seizoen 2023."
      image="/assets/images/max_cheering.gif"
      imageAlt="Third feature alt text"
    />
  </Section>
);

export { VerticalFeatures };

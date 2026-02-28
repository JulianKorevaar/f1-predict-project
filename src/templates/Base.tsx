import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Hero } from './Hero';

const Base = () => (
  <div className="antialiased bg-primary-950">
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Hero />
  </div>
);

export { Base };

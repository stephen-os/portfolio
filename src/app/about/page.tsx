import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageLayout } from '@/components/ui/PageLayout';
import { ConnectCTA } from '@/components/ui/ConnectCTA';
import { StaggerContainer, StaggerSection } from '@/components/visuals/motion';

const description =
  'Computer science graduate from James Madison University, drawn to computer graphics and machine learning. Rocketry payloads, a CAPWIC flash-talk win, guitar and the outdoors.';

export const metadata: Metadata = {
  title: 'About',
  description,
  // No `openGraph` block here on purpose: defining one without `images`
  // suppresses the inherited root opengraph-image. og:title and
  // og:description are derived from the fields above.
  alternates: { canonical: '/about' },
};

const sections = [
  {
    title: null,
    content: (
      <p className="text-lg leading-relaxed text-muted">
        My name is Stephen, and I&apos;m from a small town called Stuarts Draft in the Shenandoah Valley.
        I first got into programming in high school when one of my favorite teachers introduced a new course on game development.
        While the class wasn&apos;t very technical, it exposed me to the foundations of programming — and I was hooked.
      </p>
    ),
  },
  {
    title: 'Education',
    content: (
      <div className="space-y-4 text-muted">
        <p>
          I graduated from <span className="text-fg">James Madison University</span> in May 2024 with a degree in Computer Science,
          along with minors in Mathematics and History. I was especially drawn to courses in computer graphics
          and machine learning — subjects that combined technical depth with creativity.
        </p>
        <p>
          My mathematics minor was essential to my understanding of computer science.
          Courses like Calculus III, Probability and Statistics, and Linear Algebra gave me the foundation I needed
          for tackling challenging concepts in computer science. My interest in History comes from a desire to better understand the world;
          I believe that learning about culture, conflict, and philosophy helps us approach technology with a more thoughtful, human-centered perspective.
        </p>
        <p>
          During my time at JMU, I completed projects in a variety of languages including Java, C/C++, and Python.
          Some of my favorite projects included <span className="text-accent">Counter Cart</span>, a Minecraft-themed racing game built in WebGL and TypeScript,
          and <span className="text-accent">KiloBites</span>, a Java-based recipe management tool developed using agile principles.
        </p>
      </div>
    ),
  },
  {
    title: 'Piedmont Student Launch Team',
    content: (
      <div className="space-y-4 text-muted">
        <p>
          Before transferring to JMU, I studied at Piedmont Virginia Community College, where I joined the
          <span className="text-fg"> Piedmont Student Launch Team</span>—a NASA-sponsored program challenging students to design, build, and launch a research-based high-powered rocket.
        </p>
        <p>
          From 2019 to 2021, I focused on designing experimental payloads. One year, I developed a deployable drone system capable of autonomous rendezvous at a predefined location.
          Another year, I worked on a vision-based landing detection system that estimated touchdown coordinates without relying on GPS—using onboard sensors and environmental pattern recognition.
        </p>
        <p>
          I designed mechanical components in <span className="text-accent">Fusion 360</span>, which was my first exposure to 3D modeling and CAD software. This experience also introduced me to working with physical materials—
          including <span className="text-accent">woodworking</span>, <span className="text-accent">fiberglass layups</span>, and <span className="text-accent">soldering electronics</span>—to build and integrate custom systems into the rocket.
        </p>
      </div>
    ),
  },
  {
    title: 'CAPWIC Conference',
    content: (
      <div className="space-y-4 text-muted">
        <p>
          I had the opportunity to attend the <span className="text-fg">Capital Region Celebration of Women in Computing (CAPWIC)</span>,
          a regional conference that promotes diversity and inclusion in technology.
        </p>
        <p>
          As part of the event, my team and I presented an app we developed to showcase how algorithmic thinking can solve practical, real-world problems.
          Our project focused on helping visitors to Harrisonburg build travel itineraries and generate optimized routes based on their selected destinations.
        </p>
        <p>
          The app tackled the classic <span className="text-accent">Traveling Salesman Problem (TSP)</span>, and allowed users to experiment with different route-planning algorithms—
          giving them insight into how various approaches performed on real, dynamic data.
        </p>
        <p>
          We were thrilled to win <span className="text-accent">first place</span> in the conference&apos;s flash talk competition, earning recognition for both our technical execution and presentation.
        </p>
      </div>
    ),
  },
  {
    title: 'Personal Interests',
    content: (
      <div className="space-y-4 text-muted">
        <p>
          I have a strong passion for computer graphics and machine learning, but outside of development, I&apos;m just as drawn to music and the outdoors.
          I play guitar and love going to concerts whenever I get the chance.
        </p>
        <p>
          One of my favorite experiences is attending music festivals with friends—camping and enjoying live performances, and being immersed in nature.
          I also frequently hike the trails near my home, which helps me recharge and stay inspired.
        </p>
        <p>
          These experiences outside of technology keep me grounded and often provide unexpected inspiration for my work. Whether it&apos;s the mathematical patterns in music or the problem-solving required for outdoor adventures, I find that diverse interests make me a better developer.
        </p>
      </div>
    ),
  },
];

export default function About() {
  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title="About Me"
        subtitle={
          <>
            Hi, I&apos;m <span className="text-accent">Stephen</span> — a passionate developer from the Shenandoah Valley
          </>
        }
      />

      {/* Sections */}
      <StaggerContainer delay={0.2}>
        {sections.map((section) => (
          <StaggerSection key={section.title || 'intro'} className="card mb-8">
            {section.title && (
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            )}
            {section.content}
          </StaggerSection>
        ))}
      </StaggerContainer>

      <ConnectCTA
        title="Let's Connect"
        description="I'm always interested in discussing technology, collaborating on projects, or just having a good conversation about development and innovation."
        actions={[
          { href: '/contact', label: 'Get In Touch', variant: 'primary' },
          { href: '/projects', label: 'View Projects', variant: 'outline' },
        ]}
      />
    </PageLayout>
  );
}

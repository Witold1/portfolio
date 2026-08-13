import PageMeta from '../components/content/PageMeta';

const LINKEDIN_URL = 'https://www.linkedin.com/in/vital-yevtushenko/';
const GITHUB_URL = 'https://github.com/Witold1';
const avatarSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/about-avatar.png`;

export default function About() {
  return (
    <div className="content-page flex flex-col">
      <PageMeta
        title="About - Witold's Data Consulting"
        description="Background, skills, and focus areas."
        pathname="/about/"
      />
      <div className="content-main flex-grow">
        <div className="content-reading">
          <article className="about-intro">
            <h1 className="sr-only">About</h1>

            <div className="about-intro__copy">
              <p className="about-intro__body">
                Hello,{' '}
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  Witold1
                </a>{' '}
                is here. You might recognize me from analytical projects, blog comments, and data
                visualization work scattered around the web.
              </p>

              <p className="about-intro__body">
                The consulting side started small. I was a teaching assistant for programming and analytics 
                classes and spent a lot of late nights in a college dorm helping people understand homeworks,
                wrangle spreadsheets, and turn messy datasets into something insightful. Those side
                requests kept coming, and eventually it made sense to treat the work as its own thing.
              </p>

              <p className="about-intro__body">
                If you&apos;re interested in collaborating on a project, don&apos;t hesitate to reach
                out. Find me on{' '}
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>{' '}
                and{' '}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                .
              </p>
            </div>

            <div className="about-intro__media">
              <img
                className="about-intro__avatar"
                src={avatarSrc}
                alt=""
                width={280}
                height={280}
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

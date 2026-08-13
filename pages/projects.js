import { useMemo } from 'react';
import { getAllContent } from '../lib/content';
import { filterVisibleContent } from '../lib/content/hidden';
import ContentCard from '../components/content/ContentCard';
import PageMeta from '../components/content/PageMeta';
import ContentBreadcrumb from '../components/content/ContentBreadcrumb';
import { useAdminPrefs } from '../components/admin/AdminPrefsProvider';

const projectsBreadcrumbItems = [
  { href: '/', label: 'Home' },
  { label: 'Projects', title: 'Projects warehouse 📦' },
];

export async function getStaticProps() {
  return { props: { projects: getAllContent('projects') } };
}

export default function ProjectsIndex({ projects }) {
  const { showHiddenGallery } = useAdminPrefs();
  const visibleProjects = useMemo(
    () => filterVisibleContent(projects, { showHidden: showHiddenGallery }),
    [projects, showHiddenGallery],
  );

  return (
    <div className="content-page flex flex-col">
      <PageMeta
        title="Projects - Witold's Data Consulting"
        description="Selected projects and technical case studies."
        pathname="/projects/"
      />
      <div className="content-main flex-grow">
        <div className="content-reading">
          <div className="content-breadcrumb-rail">
            <ContentBreadcrumb items={projectsBreadcrumbItems} />
          </div>
          <div className="content-index-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project) => (
                <ContentCard
                  key={project.slug}
                  kind="project"
                  href={`/projects/${project.slug}`}
                  title={project.title}
                  subtitle={project.subtitle}
                  excerpt={project.excerpt}
                  date={project.date}
                  year={project.year}
                  image={project.coverImage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

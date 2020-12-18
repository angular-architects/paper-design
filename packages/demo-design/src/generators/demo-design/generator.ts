import { DemoDesignGeneratorSchema } from './schema';
import { Tree, apply, url, template, move, mergeWith, branchAndMerge } from '@angular-devkit/schematics';

export default function (options: DemoDesignGeneratorSchema) {
  
  return function (host: Tree) {

    const config = JSON.parse(host.read('angular.json').toString('utf8'));
    const projectName = options.project || config.defaultProject;
   
    const projectRoot = config.projects[projectName].root;
    const styles = config.projects[projectName].architect.build.options.styles || [] as string[];

    styles.unshift('node_modules/@angular-architects/paper-design/assets/scss/paper-dashboard.scss');
    styles.unshift('node_modules/@angular-architects/paper-design/assets/css/bootstrap.css');

    host.overwrite('angular.json', JSON.stringify(config, null, '\t'));

    const templateSource = apply(url('./files'), [
      template({}),
      move(projectRoot || '')
    ]);

    deleteExistingFiles(host, projectRoot);
    updateIndexHtml(projectRoot, host);

    return branchAndMerge(mergeWith(templateSource));
  }

}

function deleteExistingFiles(host: Tree, projectRoot: any) {
  host.delete(projectRoot + '/src/app/app.component.html');
  host.delete(projectRoot + '/src/app/app.module.ts');
}

function updateIndexHtml(projectRoot: any, host) {
  const indexHtmlPath = projectRoot + '/src/index.html';
  const indexHtml = host.read(indexHtmlPath).toString('utf8');
  const updatedIndexHtml = indexHtml.replace('</head>', `
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="preload" as="style" onload="this.rel='stylesheet'">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="preload" as="style" onload="this.rel='stylesheet'">
</head>
`);
  host.overwrite(indexHtmlPath, updatedIndexHtml);
}


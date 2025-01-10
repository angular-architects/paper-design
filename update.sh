npx nx build demo-design
npm unpublish @angular-architects/paper-design@2.0.0 -f --registry http://localhost:4873
npm publish dist/packages/demo-design  --registry http://localhost:4873

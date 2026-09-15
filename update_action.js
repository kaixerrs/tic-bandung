const fs = require('fs');
const path = 'apps/web/src/app/actions/eventSubmission.ts';
let content = fs.readFileSync(path, 'utf8');

const oldImagesLogic = `const imagesArray = submission.attachment_link ? [submission.attachment_link] : [];`;
const newImagesLogic = `const imagesArray = [];
      if (submission.thumbnail_link) imagesArray.push(submission.thumbnail_link);
      if (submission.gallery_links && Array.isArray(submission.gallery_links)) {
        imagesArray.push(...submission.gallery_links);
      }`;

if (content.includes(oldImagesLogic)) {
  content = content.replace(oldImagesLogic, newImagesLogic);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Action updated to map thumbnail and galleries correctly to the public events table.");
} else {
  console.log("Could not find the old images logic.");
}

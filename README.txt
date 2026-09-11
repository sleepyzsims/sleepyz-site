Sleepyz Sims site

This version uses Decap CMS with the GitHub backend.

Repository: sleepyzsims/sleepyz-site
Netlify site: https://sleepyz-sims.netlify.app
CMS: https://sleepyz-sims.netlify.app/admin/

Catalog entries are stored in content/cc.json. New entries are added to the top through Decap (add_to_top: true).

All catalog category fields are optional multi-selects: Age, Item, Type, and Hair Type can each have multiple selections or none.

The Subtitle field was removed.

To add a new option later, add a label/value pair to the relevant options list in admin/config.yml. The public filter discovers category values present in the catalog automatically.

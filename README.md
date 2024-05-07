# Contents of /Users/mikerabayda/repos/github.com/mikerabs/BrandOwnership

| File/Folder Name | Type |
|------------------|------|
| DDL_SQL/ | Directory |
|     create_data_schema.sql | File |
|     ddl_final.sql | File | All of the DDL commands to setup postgres
|     ddl_final_pt1.sql | File | Couldn't get the COPY command to work, so split the final file up into before the copy, and after the copy
|     ddl_final_pt2.sql | File | After the copy, putting everything from staging table into final relations
| README.md | File | This File!
| app.js | File | The Node.js Routes
| database_csvs/ | Directory |
|     Databases HW2 - Brands - Databases HW5 - Brands.csv | File |
|     Databases HW2 - Brands - Databases HW5 - Owners-3.csv | File |
|     Databases HW2 - Brands.csv | File |
|     Databases HW2 - Categories.csv | File |
|     Databases HW2 - SubCategoryJunction.csv | File |
|     Databases HW2 - SubCategoryJunction_fix.csv | File |
|     Databases HW2 - Subcategories.csv | File |
|     DatabasesHW5-Brands.csv | File |
|     DatabasesHW5-Owners-update.csv | File |
|     DatabasesHW5-Owners.csv | File |
|     Mongo CSV Brands - Master_Master.csv | File |
|     ddl_source_file - final_master-2.csv | File | The final cleaned CSV that works with DDL script, also used this to direct import into Mongo
| generate_readme_contents.sh | File | A fun experiment to make this README writeup easier
| img/ | Directory |
|     BrandOwnership.svg | File |
|     BrandOwnership_updated.svg | File | The SVG that shows my Postgres structure on the about page
|     IMG_0901.jpg | File | Screenshot of Tiktok on about page
|     IMG_0902.jpg | File | Screenshot of Tiktok on about page 2
| pg_pool.js | File | Gets PostgreSQL connected to my Node.js route
| public/ | Directory |
|     BON_table.html | File | An attempt at making a standardized table for the JSON to be inputted into, non functional
|     about.html | File | My updated about page from HW3?4?
|     app2.js | File | My client side JS that does all the webpage scripts, asynchronous updates
|     brand-details.html | File | The brand details for the drilldown feature
|     brand-details.js | File | Client side JS for the drilldown feature HTML
|     index.html | File | Entry point to the site, contains the query builder

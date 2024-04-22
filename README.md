# BrandOwnership
A website that uses @cancelthisclothingstore's Food Ownership, Fitness Product Ownership, and Personal Care Product Ownership's tables




app.js
/database_csvs
    'ddl_source_file - final_master-2.csv' - The final DDL source file with 649 Brands all with
    distinct subcategories
/db
/DDL_SQL
    ddl_final_pt1.sql - DDL SQL file, drops psql tables, creates new tables, alters tables with
    uniqueness constraints, creates staging table, after this is executed, run /copy command to copy
    from DDL source file into staging table
    ddl_final_pt2.sql - DDL SQL file, inserts everything from staging table into created tables  
/img - contains all the images used on the website interface
/node_modules
package.json
package-lock.json
/public - contains HTML, other files
README.md

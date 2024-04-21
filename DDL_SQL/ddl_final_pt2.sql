-- COPY command - DONT HAVE PERMISSION 
--COPY staging_brands FROM '/home/mrabayda/public_html/BrandOwnership/database_csvs/ddl_source_file -
--final_master-2.csv' DELIMITER ',' CSV HEADER;

-- Insert into Owners table from staging, handling duplicates
INSERT INTO Owners2 (Owner, Ownership_Type)
SELECT DISTINCT Owner, Ownership_Type
FROM staging_brands
ON CONFLICT (Owner) DO NOTHING;

-- Insert into Categories table from staging, handling duplicates
INSERT INTO Categories2 (Category_Name)
SELECT DISTINCT Category
FROM staging_brands
WHERE Category IS NOT NULL
ON CONFLICT (Category_Name) DO NOTHING;

-- Insert into Subcategories table from staging, handling duplicates
INSERT INTO Subcategories2 (Category_ID, Subcategory_Name)
SELECT DISTINCT c.Category_ID, s.Subcategory
FROM staging_brands s
JOIN Categories2 c ON s.Category = c.Category_Name
WHERE s.Subcategory IS NOT NULL
ON CONFLICT (Category_ID, Subcategory_Name) DO UPDATE SET ...;

-- Insert into Brands table from staging, handling duplicates
INSERT INTO Brands2 (Brand, Owner_ID, Notes)
SELECT DISTINCT s.Brand, o.Owner_ID, s.Notes
FROM staging_brands s
JOIN Owners2 o ON s.Owner = o.Owner
ON CONFLICT (Brand, Owner_ID) DO UPDATE SET ...;  -- Assuming a unique constraint on (Brand, Owner_ID)

-- Insert into BrandSubcategoryJunction table from staging
INSERT INTO BrandSubcategoryJunction2 (Brand_ID, Subcategory_ID)
SELECT DISTINCT b.Brand_ID, sc.Subcategory_ID
FROM staging_brands s
JOIN Brands2 b ON s.Brand = b.Brand AND s.Owner = (SELECT Owner FROM Owners2 WHERE Owner_ID = b.Owner_ID)
JOIN Subcategories2 sc ON s.Subcategory = sc.Subcategory_Name;

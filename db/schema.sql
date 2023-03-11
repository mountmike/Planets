CREATE DATABASE planets_app;

\c planets_app

CREATE TABLE planets (
    id SERIAL PRIMARY KEY,
    name TEXT,
    image_url TEXT, 
    diameter REAL,
    mass REAL,
    moon_count INTEGER
);

insert into planets (name, image_url, diameter, mass, moon_count) 
values ('Mercury', 'https://astrobackyard.com/wp-content/uploads/2021/03/Planet_Mercury.jpg', 4878, .055, 0);



UPDATE planets set name = '${req.body.title}', image_url = '${req.body.image_url}' where id = ${req.params.planetID};

INSERT into planets (name, diameter, mass, moon_count, image_url) VALUES ('${req.body.name}', ${req.body.diameter}, ${req.body.mass}, ${req.body.moon_count}, '${req.body.image_url}');
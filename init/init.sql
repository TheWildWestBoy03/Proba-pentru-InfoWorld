CREATE DATABASE InfoWorld;
GO

SELECT name from sys.databases;
USE InfoWorld;
GO

drop table if exists angajati;
drop table if exists echipamente;
drop table if exists componente_echipamente;
drop table if exists qr_codes;
drop table if exists magazii;
drop table if exists operatiuni;

create table angajati (
    uuid varchar(50),
    nume_intreg varchar(50),
    data_nastere date,
    email varchar(50) not null unique,
    password varchar(100) not null,
    cnp varchar(25),
    constraint angajat_cnp_pk primary key(uuid)
);
GO

create table magazii (
    uuid varchar(50),
    constraint magazie_pk primary key (uuid),

    nume varchar(50) not null,
    adresa varchar(250) not null,
);
GO

create table echipamente (
    uuid varchar(50),
    constraint echipament_id_pk primary key(uuid),

    nume varchar(50) not null,
    description varchar(150) not null,
    data_fabricatiei date,
    echipament_status varchar(100),
   
    proprietar_curent_id varchar(50),
    constraint echipament_angajat_fk 
        foreign key(proprietar_curent_id) 
        references angajati(uuid)
        on delete set null,

    magazie_curent_id varchar(50),
    constraint echipament_magazie_fk 
                foreign key(magazie_curent_id) 
                references magazii(uuid)
                on delete set null
);
GO

create table componente_echipamente (
    uuid varchar(50),
    nume_componenta varchar(50),
    descriere_componenta varchar(200),
    echipament_id varchar(50),
    constraint componenta_echipament_fk foreign key(echipament_id) 
                                        references echipamente(uuid)   
                                        on delete cascade,
    constraint componenta_pk primary key(uuid)
);
GO

create table qr_tokens (
    uuid varchar(50),
    qr_code varchar(100),
    echipament_uuid varchar(50),
    constraint qr_code_echipament_fk foreign key(echipament_uuid) 
                                    references echipamente(uuid)
                                    on delete cascade,
    constraint qr_code_id_pk primary key(uuid),
);
GO

create table operatiuni (
    date_created datetime2 default getdate(),
    uuid varchar(50) not null,
    constraint operation_pk primary key(uuid),
    nume_operatiune varchar(50),
    descriere_operatiune varchar(100),
    status_operatiune varchar(30),
    echipament_uuid varchar(50),
    finish bit
);
GO

-- angajati
declare @employee_names table (
    first_name varchar(20),
    last_name varchar(20)
)

insert into @employee_names (first_name, last_name)
values 
('Andrei', 'Popa'), ('Cosmin', 'Popescu'), ('Stefan', 'Radu'), 
('Alexandru', 'Ionescu'), ('Andreea', 'Nistor'), ('Mircea', 'Moldovan'), 
('Marius', 'Pop'), ('Darius', 'Constantinescu'), ('Adrian', 'Raul'), ('Ovidiu', 'Marcu'), ('Vlad', 'Alexandrescu');

declare @current_first_name VARCHAR(20);
declare @current_last_name VARCHAR(20);
declare _last_name_cursor cursor for 
select last_name from @employee_names;

declare _first_name_cursor cursor for 
select first_name from @employee_names;

declare @current_cnp bigint;
declare @current_uuid uniqueidentifier;
declare @generated_email varchar(50);
open _last_name_cursor;
fetch next from _last_name_cursor into @current_last_name;

while @@fetch_status = 0 
begin 
    open _first_name_cursor;
    fetch next from _first_name_cursor into @current_first_name;

    while @@fetch_status = 0
    begin
        set @current_cnp = FLOOR(RAND(CHECKSUM(NEWID())) * (10000000000000 - 1000000000000 + 1)) + 1000000000000;
        set @generated_email = concat_ws('', concat_ws('.', lower(@current_first_name), lower(@current_last_name)), '@infoworld.ro')
        set @current_uuid = lower(newid());

        print(@generated_email)
        insert into angajati (uuid, nume_intreg, data_nastere, email, password, cnp)
        values(@current_uuid, 
                concat_ws(' ', @current_first_name, @current_last_name),
                '2003-12-17',
                concat_ws('', concat_ws('.', lower(@current_first_name), lower(@current_last_name)), '@infoworld.ro'),
                concat_ws('.', lower(@current_first_name), lower(@current_last_name)),
                @current_cnp);

        fetch next from _first_name_cursor into @current_first_name;
    end

    close _first_name_cursor;
    fetch next from _last_name_cursor into @current_last_name;
end

close _last_name_cursor;
deallocate _last_name_cursor;
deallocate _first_name_cursor;

GO


-- echipamente

declare @nume_echipamente table (
    nume varchar(50)
)

insert into @nume_echipamente (nume)
values ('Router'), ('Calculator de Gaming'), ('Laptop Lenovo IdeaPad 3500U'), ('Laptop Lenovo'), ('Laptop Dell Vostro 3520'),
       ('Samsung Galaxy S4'), ('Samsung Galaxy S5'), ('Samsung Galaxy S6'), ('Samsung Galaxy S7'), ('Samsung Galaxy S8'),
       ('Samsung Galaxy S9'), ('Samsung Galaxy S10'), ('Samsung Galaxy S20'), ('Samsung Galaxy S23'), ('Samsung Galaxy S25'),
       ('Iphone X'), ('Iphone 17 Pro'), ('Iphone 17'), ('Iphone 6 Pro'), ('Iphone 16'),
       ('Iphone SE'), ('Iphone 7'), ('Iphone 8'), ('nokia 3500'), ('Nokia 3400'),
       ('Frigider Samsung'), ('Frigider Arctic'), ('Video proiector performant'),
        ('Monitor Gaming ASUS ROG 27 inch'), ('Monitor Curbat Dell UltraSharp'), ('Tastatura Mecanica Logitech'), 
        ('Mouse Ergonomic MX Master 3S'), ('Casti Wireless Bose QuietComfort'),('Sistem Audio Soundbar Sony'),
        ('Server Rackabil HP ProLiant Gen11'), ('Switch Cisco Catalyst 24 Porturi'), ('Stocare NAS Synology 4-Bay'), 
        ('Access Point Ubiquiti'), ('Firewall Hardware Fortinet'), ('iPad Pro 12.9 M4'), 
        ('Samsung Galaxy Tab S9 Ultra'), ('Apple Watch Ultra 2'), ('Ochelari VR Meta Quest 3'), 
        ('Kindle Paperwhite E-reader'), ('MacBook Pro 16 M3 Max'), ('MacBook Air 13 M3'), 
        ('Asus ROG Zephyrus G16'), ('Workstation Lenovo'), ('Microsoft Surface Pro 10'),
        ('Imprimanta Laser Color HP'), ('Scanner Documente Canon Fast'), ('Camera Web Logi Brio 4K'), 
        ('Microfon Shure SM7B'), ('Tableta Grafica Wacom '), ('Purificator de Aer'), 
        ('Aparat de Cafea DeLonghi'), ('Aparat de Aer Conditionat'), ('Distrugator Documente')

declare @nume_echipament varchar(50);
declare @descriere_echipament varchar(150);
declare @echipament_status varchar(25);
declare @an int;
declare @luna int;
declare @zi int;
declare @data_fabricatiei date;
declare @current_uuid uniqueidentifier;

declare _cursor_nume_echipamente cursor for
select nume from @nume_echipamente;

open _cursor_nume_echipamente;

fetch next from _cursor_nume_echipamente into @nume_echipament;

while @@fetch_status = 0
begin
    set @an = FLOOR(RAND(CHECKSUM(NEWID())) * (2026 - 2010 + 1)) + 2010;
    set @zi = FLOOR(RAND(CHECKSUM(NEWID())) * (29 - 1 + 1)) + 1;
    set @luna = FLOOR(RAND(CHECKSUM(NEWID())) * (12 - 1 + 1)) + 1;

    set @data_fabricatiei = concat_ws('-', cast(@an as varchar(4)), cast(@luna as varchar(2)), cast(@zi as varchar(2)));
    set @echipament_status = 'created';
    set @descriere_echipament = concat_ws('', 'Descriere pentru echipamentul: ', @nume_echipament);
    set @current_uuid = newid();

    print(@data_fabricatiei);
    insert into echipamente(uuid, nume, description, data_fabricatiei, echipament_status)
    values(@current_uuid, @nume_echipament, @descriere_echipament, @data_fabricatiei, @echipament_status);

    fetch next from _cursor_nume_echipamente into @nume_echipament;
end

close _cursor_nume_echipamente;
deallocate _cursor_nume_echipamente;
GO

-- componente echipamente

declare @nume_componente_temp table (
    nume varchar(50)
);

insert into @nume_componente_temp (nume)
values ('Cooler'), ('Placa Grafica'), ('Motherboard'), ('CPU'), ('Ecran Display AMOLED'), ('Carcasa'), ('Husa'),
        ('Antena'), ('Memorie RAM'), ('SSD'), ('HDD'), ('Placa de Retea');

declare @nume_componenta varchar(50);
declare _cursor_nume_componente cursor for
select nume from @nume_componente_temp;

open _cursor_nume_componente;
fetch next from _cursor_nume_componente into @nume_componenta;

while @@fetch_status = 0
begin
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id)
    values(newid(), @nume_componenta, concat_ws('', 'Descriere pentru componenta: ', @nume_componenta), NULL);
    fetch next from _cursor_nume_componente into @nume_componenta;
end

close _cursor_nume_componente;
deallocate _cursor_nume_componente;

GO

-- magazii

declare @magazii_temp table (
    nume varchar(50),
    adresa varchar(250)
);

insert into @magazii_temp (nume, adresa)
values 
('InfoWorld Showroom Băneasa', 'Șoseaua București-Ploiești nr. 42-44, Centrul Comercial Băneasa, Corp Galeria Comercială'),
('InfoWorld Cluj-Vest', 'Strada Avram Iancu nr. 492-500, Centrul Comercial Vivo!, Unitatea G30'),
('InfoWorld Timișoara Shopping City', 'Calea Șagului nr. 100, Retail Park Shopping City, Pavilionul Electro'), 
('InfoWorld Iași Central', 'Strada Palat nr. 1, Complex Palas Mall, Nivelul -1'),
('InfoWorld Brașov Coresi', 'Strada Zaharia Stancu nr. 1, Coresi Shopping Resort, Corpul B'), 
('InfoWorld Constanța Nord', 'Bulevardul Aurel Vlaicu nr. 220, Centrul Comercial Vivo! Constanța'), 
('InfoWorld Craiova Mall', 'Calea București nr. 80, Electroputere Parc, Pavilionul Central'), 
('InfoWorld Oradea Sud', 'Calea Aradului nr. 62, Era Shopping Park, Unitatea Comercială 4');

declare @current_nume VARCHAR(20);
declare @current_adresa VARCHAR(20);
declare _magazie_cursor cursor for 
select nume, adresa from @magazii_temp;

open _magazie_cursor;
fetch next from _magazie_cursor into @current_nume, @current_adresa;

while @@fetch_status = 0 
begin 
    insert into magazii (uuid, nume, adresa)
    values(newid(), @current_nume, @current_adresa);

    fetch next from _magazie_cursor into @current_nume, @current_adresa;
end

close _magazie_cursor;
deallocate _magazie_cursor;

GO

select * from magazii;
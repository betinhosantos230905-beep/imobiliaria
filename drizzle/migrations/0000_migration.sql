create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- primeiro usuário cadastrado vira admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  purpose text not null default 'venda',
  type text not null default 'casa',
  price numeric not null default 0,
  city text not null default '',
  neighborhood text not null default '',
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  parking int not null default 0,
  area numeric not null default 0,
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.properties to anon;
grant select, insert, update, delete on public.properties to authenticated;
grant all on public.properties to service_role;
alter table public.properties enable row level security;
create policy "public read published" on public.properties for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.properties for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.properties for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.properties for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null default '',
  property_id uuid references public.properties(id) on delete set null,
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon;
grant select, insert, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "anyone send lead" on public.leads for insert to anon, authenticated with check (length(name) between 1 and 120 and length(email) between 3 and 200 and length(message) <= 2000);
create policy "admin read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "public read imoveis" on storage.objects for select using (bucket_id = 'imoveis');
create policy "admin upload imoveis" on storage.objects for insert to authenticated with check (bucket_id = 'imoveis' and public.has_role(auth.uid(),'admin'));
create policy "admin delete imoveis" on storage.objects for delete to authenticated using (bucket_id = 'imoveis' and public.has_role(auth.uid(),'admin'));

insert into public.properties (title, description, purpose, type, price, city, neighborhood, bedrooms, bathrooms, parking, area, images, featured) values
('Casa contemporânea com piscina','Residência de alto padrão com amplo jardim, piscina aquecida e integração total entre sala e área gourmet.','venda','casa',2850000,'Curitiba','Santa Felicidade',4,5,4,420,'{/images/casa-1.jpg,/images/interior-1.jpg}',true),
('Apartamento com vista panorâmica','Andar alto, varanda gourmet e acabamento premium em localização privilegiada.','venda','apartamento',1290000,'Curitiba','Batel',3,3,2,145,'{/images/apto-1.jpg,/images/interior-1.jpg}',true),
('Cobertura duplex mobiliada','Cobertura com terraço, jacuzzi e vista para o parque. Pronta para morar.','aluguel','apartamento',9800,'Curitiba','Ecoville',3,4,3,210,'{/images/cobertura-1.jpg,/images/interior-1.jpg}',true),
('Sobrado em condomínio fechado','Segurança 24h, área verde e lazer completo para a família.','venda','casa',1650000,'Curitiba','Campo Comprido',3,4,2,260,'{/images/casa-2.jpg,/images/interior-1.jpg}',false);
create schema if not exists "next_auth";

create table "next_auth"."accounts" (
    "id" uuid not null default gen_random_uuid(),
    "type" text not null,
    "provider" text not null,
    "providerAccountId" text not null,
    "refresh_token" text,
    "access_token" text,
    "expires_at" bigint,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    "oauth_token_secret" text,
    "oauth_token" text,
    "userId" uuid
);


create table "next_auth"."sessions" (
    "id" uuid not null default gen_random_uuid(),
    "expires" timestamp with time zone not null,
    "sessionToken" text not null,
    "userId" uuid
);


create table "next_auth"."users" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "email" text,
    "emailVerified" timestamp with time zone,
    "image" text
);


create table "next_auth"."verification_tokens" (
    "identifier" text,
    "token" text not null,
    "expires" timestamp with time zone not null
);


CREATE UNIQUE INDEX accounts_pkey ON next_auth.accounts USING btree (id);

CREATE UNIQUE INDEX email_unique ON next_auth.users USING btree (email);

CREATE UNIQUE INDEX provider_unique ON next_auth.accounts USING btree (provider, "providerAccountId");

CREATE UNIQUE INDEX sessions_pkey ON next_auth.sessions USING btree (id);

CREATE UNIQUE INDEX sessiontoken_unique ON next_auth.sessions USING btree ("sessionToken");

CREATE UNIQUE INDEX token_identifier_unique ON next_auth.verification_tokens USING btree (token, identifier);

CREATE UNIQUE INDEX users_pkey ON next_auth.users USING btree (id);

CREATE UNIQUE INDEX verification_tokens_pkey ON next_auth.verification_tokens USING btree (token);

alter table "next_auth"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "next_auth"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "next_auth"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "next_auth"."verification_tokens" add constraint "verification_tokens_pkey" PRIMARY KEY using index "verification_tokens_pkey";

alter table "next_auth"."accounts" add constraint "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE not valid;

alter table "next_auth"."accounts" validate constraint "accounts_userId_fkey";

alter table "next_auth"."accounts" add constraint "provider_unique" UNIQUE using index "provider_unique";

alter table "next_auth"."sessions" add constraint "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE not valid;

alter table "next_auth"."sessions" validate constraint "sessions_userId_fkey";

alter table "next_auth"."sessions" add constraint "sessiontoken_unique" UNIQUE using index "sessiontoken_unique";

alter table "next_auth"."users" add constraint "email_unique" UNIQUE using index "email_unique";

alter table "next_auth"."verification_tokens" add constraint "token_identifier_unique" UNIQUE using index "token_identifier_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION next_auth.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$function$
;

grant delete on table "next_auth"."accounts" to "service_role";

grant insert on table "next_auth"."accounts" to "service_role";

grant references on table "next_auth"."accounts" to "service_role";

grant select on table "next_auth"."accounts" to "service_role";

grant trigger on table "next_auth"."accounts" to "service_role";

grant truncate on table "next_auth"."accounts" to "service_role";

grant update on table "next_auth"."accounts" to "service_role";

grant delete on table "next_auth"."sessions" to "service_role";

grant insert on table "next_auth"."sessions" to "service_role";

grant references on table "next_auth"."sessions" to "service_role";

grant select on table "next_auth"."sessions" to "service_role";

grant trigger on table "next_auth"."sessions" to "service_role";

grant truncate on table "next_auth"."sessions" to "service_role";

grant update on table "next_auth"."sessions" to "service_role";

grant delete on table "next_auth"."users" to "service_role";

grant insert on table "next_auth"."users" to "service_role";

grant references on table "next_auth"."users" to "service_role";

grant select on table "next_auth"."users" to "service_role";

grant trigger on table "next_auth"."users" to "service_role";

grant truncate on table "next_auth"."users" to "service_role";

grant update on table "next_auth"."users" to "service_role";

grant delete on table "next_auth"."verification_tokens" to "service_role";

grant insert on table "next_auth"."verification_tokens" to "service_role";

grant references on table "next_auth"."verification_tokens" to "service_role";

grant select on table "next_auth"."verification_tokens" to "service_role";

grant trigger on table "next_auth"."verification_tokens" to "service_role";

grant truncate on table "next_auth"."verification_tokens" to "service_role";

grant update on table "next_auth"."verification_tokens" to "service_role";


create type "public"."app_permission" as enum ('SELECT', 'INSERT', 'UPDATE', 'DELETE');

create type "public"."app_role" as enum ('admin', 'chatter', 'manager', 'hr');

create table "public"."role_permissions" (
    "id" bigint generated by default as identity not null,
    "role" app_role not null,
    "permission" app_permission not null
);


alter table "public"."role_permissions" enable row level security;

create table "public"."user_roles" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid not null,
    "role" app_role not null
);


alter table "public"."user_roles" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "username" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX role_permissions_pkey ON public.role_permissions USING btree (id);

CREATE UNIQUE INDEX role_permissions_role_permission_key ON public.role_permissions USING btree (role, permission);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."role_permissions" add constraint "role_permissions_pkey" PRIMARY KEY using index "role_permissions_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_permission_key" UNIQUE using index "role_permissions_role_permission_key";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission app_permission)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  bind_permissions int;
begin
  select count(*)
  from public.role_permissions
  where role_permissions.permission = authorize.requested_permission
    and role_permissions.role = (auth.jwt() ->> 'user_role')::public.app_role
  into bind_permissions;
  
  return bind_permissions > 0;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user(email text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth'
AS $function$
  declare
  user_id uuid;
begin
  user_id := extensions.uuid_generate_v4();
  
  insert into auth.users (id, email)
    values (user_id, email)
    returning id into user_id;

    return user_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
declare is_admin boolean;
begin
  insert into public.users (id, username)
  values (new.id, new.email);
  
  select count(*) = 1 from auth.users into is_admin;
  
  insert into public.user_roles (user_id, role) values (new.id, 'admin');
  
  return new;
end;
$function$
;

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant select on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant references on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Allow individual read access"
on "public"."user_roles"
as permissive
for select
to public
using (((auth.uid() = user_id) AND authorize('SELECT'::app_permission)));


create policy "Allow authorized delete access"
on "public"."users"
as permissive
for delete
to public
using (authorize('DELETE'::app_permission));


create policy "Allow individual insert access"
on "public"."users"
as permissive
for insert
to public
with check (((auth.uid() = id) AND authorize('INSERT'::app_permission)));


create policy "Allow individual update access"
on "public"."users"
as permissive
for update
to public
using (((auth.uid() = id) AND authorize('UPDATE'::app_permission)));


create policy "Allow logged-in read access"
on "public"."users"
as permissive
for select
to public
using (((auth.role() = 'authenticated'::text) AND authorize('SELECT'::app_permission)));



create schema if not exists "rbac";



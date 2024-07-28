drop policy "Allow individual insert access" on "public"."users";

alter table "public"."user_roles" disable row level security;

alter table "public"."users" disable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
begin
  insert into public.users (id, username)
  values (new.id, new.email);
  
  insert into public.user_roles (user_id, role) values (new.id, 'admin');
  
  return new;
end;
$function$
;

create policy "Allow individual insert access"
on "public"."users"
as permissive
for insert
to public
with check ((auth.uid() = id));




dev:
	foreman start -f Procfile.dev
reset:
	bin/rails db:environment:set RAILS_ENV=development
	bin/rails db:migrate:reset db:seed
	bin/rails route_map:write
locale-dump:
	bin/rails json_translations:dump
locale-watch:
	bin/rails json_translations:watch_yaml
constants-dump:
	bin/rails json_constants:dump
constants-watch:
	bin/rails json_constants:watch

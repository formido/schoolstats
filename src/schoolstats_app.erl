%% Feel free to use, reuse and abuse the code in this file.

%% @private
-module(schoolstats_app).
-behaviour(application).

%% API.
-export([start/2]).
-export([stop/1]).

%% API.

start(_Type, _Args) ->
	Dispatch = cowboy_router:compile([
		{'_', [
		       {"/api", api_handler, []},
		       {"/[...]", cowboy_static, {priv_dir, schoolstats, "",
						  [{mimetypes, cow_mimetypes, all}]}}
		      ]}
	]),
	{ok, _} = cowboy:start_http(http, 100, [{port, 8008}], [
		{env, [{dispatch, Dispatch}]}
	]),
	schoolstats_sup:start_link().

stop(_State) ->
	ok.

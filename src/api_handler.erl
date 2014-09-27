-module(api_handler).
-behaviour(cowboy_http_handler).

-export([init/3]).
-export([handle/2]).
-export([terminate/3]).

-record(state, {
}).

init(_, Req, _Opts) ->
	{ok, Req, #state{}}.

handle(Req, State) ->
    %% Script = Filename:join(code:lib_dir(schoolstats), 'bin/school.js'),
    %% Result = os:cmd(Script),
    {ok, Result} = file:read_file('test/test.json'),
    {ok, Req2} = cowboy_req:reply(200, [
					{<<"content-type">>, <<"text/plain">>}
					], Result, Req),
    {ok, Req2, State}.

terminate(_Reason, _Req, _State) ->
	ok.

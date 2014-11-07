-module(schoolstats).
-behaviour(gen_server).

-define(SERVER, ?MODULE).

%% API.
-export([start_link/0]).
-export([since_last_grades/0,
	 download_grades/0,
	 get_last_grades/0,
	 last_time/0]).

%% gen_server.
-export([init/1]).
-export([handle_call/3]).
-export([handle_cast/2]).
-export([handle_info/2]).
-export([terminate/2]).
-export([code_change/3]).

-record(state, {
}).

%% API.

-spec start_link() -> {ok, pid()}.
start_link() ->
    gen_server:start_link({global, ?SERVER}, ?MODULE, [], []).

get_last_grades() ->
    gen_server:call(global:whereis_name(?SERVER), get_last_grades).

last_time() ->
    {ok, Files} = file:list_dir(filename:join(code:lib_dir(schoolstats), 'test')),
    Times = [list_to_integer(hd(string:tokens(Fn, "."))) || Fn <- Files],
    lists:max(Times).

since_last_grades() ->
    UniversalTime = calendar:datetime_to_gregorian_seconds(calendar:now_to_universal_time(now())),
    UnixTime = UniversalTime-719528*24*3600,
    (UnixTime-last_time())/3600.

download_grades() ->
    Script = filename:join(code:lib_dir(schoolstats), 'bin/school.js'),
    io:format("~p~n", [os:cmd(Script)]).

%% gen_server.

init([]) ->
    error_logger:info_msg("...starting schoolstats.~n"),
    FiveMin = 5 * 60 * 1000,
    timer:send_after(0, maybe_download_grades),
    timer:send_interval(FiveMin, maybe_download_grades),
    {ok, #state{}}.

handle_call(get_last_grades, _From, State) ->
    {ok, Bin} = file:read_file(filename:join([code:lib_dir(schoolstats), 'test', integer_to_list(last_time()) ++ ".json"])),
    {reply, Bin, State};
handle_call(_Request, _From, State) ->
    {reply, ignored, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(maybe_download_grades, State) ->
    Passed = since_last_grades(),
    {_Date, {Hour, _Min, _Sec}} = erlang:localtime(),
    case Hour >= 6 andalso Hour =< 22 andalso Passed >= 3 of
	true ->
	    download_grades(),
	    error_logger:info_msg("...downloaded grades.~n");
	false ->
	    ok
    end,
    {noreply, State};
handle_info(_Info, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.


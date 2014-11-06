-module(schoolstats).
-behaviour(gen_server).

%% API.
-export([start_link/0]).
-export([since_last_grades/0,
	 download_grades/0]).

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
    gen_server:start_link(?MODULE, [], []).

since_last_grades() ->
    {ok, Files} = file:list_dir(filename:join(code:lib_dir(schoolstats), 'test')),
    Times = [list_to_integer(hd(string:tokens(Fn, "."))) || Fn <- Files],
    Times2 = lists:reverse(lists:sort(Times)),
    LastGradesSecs = hd(Times2),
    UniversalTime = calendar:datetime_to_gregorian_seconds(calendar:now_to_universal_time(now())),
    UnixSecs = UniversalTime-719528*24*3600,
    (UnixSecs-LastGradesSecs)/3600.

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

handle_call(_Request, _From, State) ->
    {reply, ignored, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(maybe_download_grades, State) ->
    Diff = since_last_grades(),
    {_Date, {Hour, _Min, _Sec}} = erlang:localtime(),
    case Hour >= 6 andalso Hour =< 22 andalso Diff >= 3 of
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


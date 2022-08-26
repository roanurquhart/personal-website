module Main exposing (..)

import Browser exposing (Document)
import CSSTest
import Html exposing (Html, h1, span, text)
import Html.Attributes exposing (class)
import Task
import Time


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { name : String
    , zone : Time.Zone
    , time : Time.Posix
    }


type Msg
    = Tick Time.Posix
    | AdjustTimeZone Time.Zone


init : () -> ( Model, Cmd Msg )
init time =
    ( Model "Roan Urquhart" Time.utc (Time.millisToPosix 0), Task.perform AdjustTimeZone Time.here )


view : Model -> Document Msg
view model =
    let
        hour =
            String.fromInt (Time.toHour model.zone model.time)

        minute =
            String.fromInt (Time.toMinute model.zone model.time)

        second =
            String.fromInt (Time.toSecond model.zone model.time)
    in
    Document "Home" [ CSSTest.view (CSSTest.Model hour minute second) ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick newTime ->
            ( { model | time = newTime }
            , Cmd.none
            )

        AdjustTimeZone newZone ->
            ( { model | zone = newZone }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every 1000 Tick

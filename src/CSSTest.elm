module CSSTest exposing (..)

import Browser
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
import Html exposing (Html, div, h1, text)


type alias Model =
    { hour : String
    , minute : String
    , second : String
    }


view : Model -> Html msg
view model =
    div []
        [ stylesheet
        , exampleHero
        , h1 [] [ text (model.hour ++ ":" ++ model.minute ++ ":" ++ model.second) ]
        , exampleColumns
        ]


exampleHero : Html msg
exampleHero =
    hero { heroModifiers | size = Medium, color = Primary }
        []
        [ heroBody []
            [ container []
                [ title H1 [] [ text "Hero Title" ]
                , title H2 [] [ text "Hero Subtitle" ]
                ]
            ]
        ]


exampleColumns : Html msg
exampleColumns =
    section NotSpaced
        []
        [ container []
            [ columns columnsModifiers
                []
                [ column columnModifiers [] [ text "First Column" ]
                , column columnModifiers [] [ text "Second Column" ]
                , column columnModifiers [] [ text "Third Column" ]
                ]
            ]
        ]

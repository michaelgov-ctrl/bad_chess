package main

import (
	"encoding/json"
	"fmt"
)

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type EventHandler func(event Event, c *Client) error

const (
	EventAssignedMatch    = "assigned_match"
	EventMatchOver        = "match_over"
	EventMatchStarted     = "match_started"
	EventJoinMatchRequest = "join_match"
	EventMakeMove         = "make_move"
	EventMatchError       = "match_error"
	EventNewMatchRequest  = "new_match"
	EventPropagateMove    = "propagate_move"
)

type JoinMatchEvent struct {
	TimeControl TimeControl `json:"time_control"`
}

type MakeMoveEvent struct {
	Move string `json:"move"`
	//Player string `json:"player"`
}

type PropagateMoveEvent struct {
	PlayerColor string `json:"player"`
	MoveEvent   MakeMoveEvent
}

type ErrorEvent struct {
	Error string `json:"error"`
}

func NewOutgoingEvent(t string, evt any) (Event, error) {
	data, err := json.Marshal(evt)
	if err != nil {
		return Event{}, fmt.Errorf("failed to marshal event: %v: %v", evt, err)
	}

	out := Event{
		Payload: data,
		Type:    t,
	}

	return out, nil
}

func NewErrorToEvent(errorType, msg string) (*Event, error) {
	data, err := json.Marshal(ErrorEvent{Error: msg})
	if err != nil {
		return nil, err
	}

	e := &Event{
		Type:    msg,
		Payload: data,
	}

	return e, nil
}

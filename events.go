package main

import "encoding/json"

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type EventHandler func(event Event, c *Client) error

const (
	EventMakeMove      = "make_move"
	EventPropagateMove = "propagate_move"
	EventMatchError    = "match_error"
)

type MakeMoveEvent struct {
	Move   string `json:"move"`
	Player string `json:"player"`
}

type PropagateMoveEvent struct {
	MakeMoveEvent
}

type ErrorEvent struct {
	Error string `json:"error"`
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
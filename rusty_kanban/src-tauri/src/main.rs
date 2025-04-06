// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusty_kanban::{KanbanBoard, KanbanCard};

fn main() {
    let mut board = KanbanBoard::new();
    board.add_card(KanbanCard {
        id: "1".to_string(),
        title: "Welcome".to_string(),
        description: "Welcome to RustyKanban!".to_string(),
        status: "Todo".to_string(),
    });
    println!("Board initialized with {} cards", board.get_cards().len());
}

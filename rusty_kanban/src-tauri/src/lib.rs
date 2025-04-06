#[derive(Debug, Clone, PartialEq)]
pub struct KanbanCard {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
}

pub struct KanbanBoard {
    cards: Vec<KanbanCard>,
}

impl KanbanBoard {
    pub fn new() -> Self {
        KanbanBoard { cards: Vec::new() }
    }

    pub fn add_card(&mut self, card: KanbanCard) {
        self.cards.push(card);
    }

    pub fn get_cards(&self) -> &Vec<KanbanCard> {
        &self.cards
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_board() {
        let board = KanbanBoard::new();
        assert!(board.cards.is_empty());
    }

    #[test]
    fn test_add_card() {
        let mut board = KanbanBoard::new();
        let card = KanbanCard {
            id: "1".to_string(),
            title: "Test Card".to_string(),
            description: "Test Description".to_string(),
            status: "Todo".to_string(),
        };
        board.add_card(card.clone());
        assert_eq!(board.cards.len(), 1);
        assert_eq!(board.cards[0], card);
    }

    #[test]
    fn test_get_cards() {
        let mut board = KanbanBoard::new();
        let card = KanbanCard {
            id: "1".to_string(),
            title: "Test Card".to_string(),
            description: "Test Description".to_string(),
            status: "Todo".to_string(),
        };
        board.add_card(card.clone());
        assert_eq!(board.get_cards().len(), 1);
        assert_eq!(&board.cards[0], &card);
    }
}

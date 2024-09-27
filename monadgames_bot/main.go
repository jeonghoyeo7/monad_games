package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	tele "gopkg.in/telebot.v3"
)

func main() {
	// load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	botToken := os.Getenv("BOT_TOKEN")
	if botToken == "" {
		log.Fatal("BOT_TOKEN is not set in .env file")
	}

	b, err := tele.NewBot(tele.Settings{
		Token:  botToken,
		Poller: &tele.LongPoller{Timeout: 10 * time.Second},
	})
	if err != nil {
		log.Fatal("Failed to create bot:", err)
	}

	// 메시지 출력: 봇이 실행 중이라는 로그를 출력
	log.Println("MonadGamesBot is running...")

	// Universal markup builders
	menu := &tele.ReplyMarkup{ResizeKeyboard: true}

	// Define the buttons
	btnMolandakGame := menu.Text("molandak game")
	btnContributor := menu.Text("contributor")

	// Setting up the reply menu with the two buttons
	menu.Reply(
		menu.Row(btnMolandakGame),
		menu.Row(btnContributor),
	)

	// Inline button for the Molandak game (link button)
	gameURLButton := tele.InlineButton{
		Unique: "game_url",
		Text:   "Play Molandak Game",
		URL:    "https://monad-games-bibiduk.pages.dev/",
	}

	// Handle the "/start" command to show the menu
	b.Handle("/start", func(c tele.Context) error {
		return c.Send("Choose an option:", menu)
	})

	// Handle the "molandak game" button to show the inline link button
	b.Handle(&btnMolandakGame, func(c tele.Context) error {
		// This sends a message with an inline button linking to the game URL
		return c.Send("Click the button below to play Molandak Game!", &tele.SendOptions{
			ReplyMarkup: &tele.ReplyMarkup{
				InlineKeyboard: [][]tele.InlineButton{
					{gameURLButton},
				},
			},
		})
	})

	// Handle the "contributor" button to show a list of contributors
	b.Handle(&btnContributor, func(c tele.Context) error {
		// You can replace the list below with actual contributor data
		contributorList := "1. baeksu"
		return c.Send("Contributor List:\n" + contributorList)
	})

	// 봇 실행
	b.Start()
}


## Run the game

	http://coodoo.github.io/sweep/


## How to build

	$ npm install 

	$ gulp

## Open a new terminal window and run 

	$ node server.js

	- then visit: http://localhost:8000

# 功能
	
	✔ + clicked, flagged 格子樣式
		✔ - count=0: 不顯示數字，其餘顯示 
		✔ - 一律白底
		✔ - 沒按過的是 grey
		✔ - flagged 的一律綠底
	
	✔ + flagged 要能取消
		✔ - 並且要將 bomb count 減一

	✔ + bomb 總數顯示
	✔ + 判斷 game win
	✔ + 判斷 game lose	
	
	✔ + reset 功能
	
	✔ + 加大/縮小格式數功能
	
	✔ + timer 啟動與更新顯示
	
	✔ + 避開 0 bomb 的情況
	
	✔ + 第一次按不能是 bomb 
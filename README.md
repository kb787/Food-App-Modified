Running The Project Instructions :- 
1. The root is divided into 2 main folders client (frontend of the app) and server (backend of the app)
2. The frontend components are stored in folder hierarchy :- root -> client -> myapp 
3. To start Metro server open the terminal of vs-code which will already take to project root folder
4. In terminal hit the command :- cd client/myapp 
5. The above will take to directory which contains modules and package.json file essential for running the project
6. In the above directory hit the command :- npx expo start (Assuming that expo installation is done)
7. This runs the metro server at port no 8081
8. In server folder create a file named as .env
9. Use the above environment variables and save the .env file :-
    
     express_server_port_no = "3500"
    
     mongodb_connection_string = "mongodb+srv://KaranBhanushali:Kb19092003%40@cluster0.fpqcnoe.mongodb.net/foodDeliveryApp"
   
     base_api_endpoint = "/v1/api"
   
     native_server_link = "http://192.168.79.116:8081"
     
10. Here the 192.168.79.116 is WLAN IP-Address of my system so while using API ensure to replace the WLAN IP Address of your system
11. In command prompt type the command ipconfig and copy the IPV4 Address provided in Wireless LAN Adapter
12. Open another terminal in VS-Code and hit the command :- cd server
13. This will take to server folder directory where package.json file of nodejs server is located
14. In the above directory hit the command :- npm start
15. Now Both Server Metro Server (React-Native) at port no 8081 and Node.js server at port no 3500 are started and API requests can be performed   

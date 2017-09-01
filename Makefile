compile: deps
	@truffle --network local compile
	@solidity_flattener --solc-paths=zeppelin-solidity=$(shell pwd)/node_modules/zeppelin-solidity/ contracts/Presale.sol > build/CombinedPresale.sol 
	@solc zeppelin-solidity=$(shell pwd)/node_modules/zeppelin-solidity/ contracts/Token.sol  --abi  2>/dev/null| grep :Token -A2 | tail -n1 > build/Token.abi
	@solc zeppelin-solidity=$(shell pwd)/node_modules/zeppelin-solidity/ contracts/Presale.sol  --abi  2>/dev/null| grep :Presale -A2 | tail -n1 > build/Presale.abi

node_modules:
	npm install

deps: node_modules
	@pip3 install solidity_flattener -q
	
test: node_modules
	@truffle --network local test tests/*.js

testrpc:
	testrpc \
		--account="0x7e9a1de56cce758c544ba5dea3a6347a4a01c453d81edc32c2385e9767f29505, 1000000000000000000000000000000000000000" \
		--account="0x1fdc76364db4a4bcfad8f2c010995a96fcb98a165e34858665a234ba5471520b, 0" \
		--account="0xf2029a2f20a9f57cd1a9a2a44c63d0c875f906c646f333b028cb6f1c38ef7db5, 1000000000000000000000000000000000000000" \

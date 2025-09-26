// TASK ZK
// function printNumbers() {
// 	let count = 1;

// 	const intervalId = setInterval(() => {
// 		console.log(count);
// 		if (count === 5) {
// 			clearInterval(intervalId);
// 		}
// 		count++;
// 	}, 1000);
// }

// printNumbers();

// TASK ZM
// function reverseInteger(num) {
// 	const reversed = num.toString().split('').reverse().join('');
// 	return parseInt(reversed, 10);
// }

// console.log(reverseInteger(123456789));

// TASK ZL
// function stringToKebab(str: string) {
// 	return str
// 		.toLowerCase()
// 		.replace(/[^a-z0-9\s]/g, '')
// 		.trim()
// 		.replace(/\s+/g, '-');
// }
// console.log(stringToKebab('I love Kebab'));

// console.log('***************');

// // TEST
// function stringToKebab1(str: string) {
// 	return str
// 		.toLowerCase()
// 		.replace(/[^\p{L}\p{N}\s-]/gu, '')
// 		.trim()
// 		.replace(/[\s_-]+/g, '-')
// 		.replace(/^-+|-+$/g, '');
// }

// console.log(stringToKebab1('I love Kebab'));
// console.log(stringToKebab1('Hello World Im Toby!'));
// console.log(stringToKebab1('데벡스 아카데미 최고야!'));
// console.log(stringToKebab1('Девекс Академия самая классная!'));

// TASK ZN

// function rotateArray(arr, index) {
// 	const firstPart = arr.slice(0, index + 1);
// 	const secondPart = arr.slice(index + 1);
// 	return secondPart.concat(firstPart);
// }

// console.log(rotateArray([1, 2, 3, 4, 5, 6], 3));

// TASK ZO

// function areParenthesesBalanced(str) {
// 	let balance = 0;

// 	for (let char of str) {
// 		if (char === '(') {
// 			balance++;
// 		} else if (char === ')') {
// 			balance--;
// 			if (balance < 0) {
// 				return false;
// 			}
// 		}
// 	}

// 	return balance === 0;
// }

// console.log(areParenthesesBalanced('string()ichida(qavslar)soni()balansda'));
// console.log(areParenthesesBalanced('((()))'));
// console.log(areParenthesesBalanced('(()'));
// console.log(areParenthesesBalanced(')('));

// TASK

// function areArraysEqual(arr1: any[], arr2: any[]): boolean {
// 	const set1 = new Set(arr1);
// 	const set2 = new Set(arr2);

// 	for (const val of set1) {
// 		if (!set2.has(val)) return false;
// 	}

// 	for (const val of set2) {
// 		if (!set1.has(val)) return false;
// 	}

// 	return true;
// }

// console.log(areArraysEqual([1, 2, 3], [3, 1, 2]));
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1]));
// console.log(areArraysEqual([1, 2, 3], [4, 1, 2]));

// TASK ZQ
// function findDuplicates(arr: number[]): number[] {
// 	const count: Record<number, number> = {};
// 	const result: number[] = [];

// 	for (const num of arr) {
// 		count[num] = (count[num] || 0) + 1;
// 	}

// 	for (const key in count) {
// 		if (count[key] > 1) {
// 			result.push(Number(key));
// 		}
// 	}

// 	return result;
// }

// const nums = [1, 2, 3, 4, 5, 4, 3, 4];
// console.log(findDuplicates(nums));

// TASK ZR
// function countNumberAndLetters(input: string): { number: number; letter: number } {
// 	let number = 0;
// 	let letter = 0;

// 	for (let char of input) {
// 		if (/[0-9]/.test(char)) {
// 			number++;
// 		} else if (/[a-zA-Z]/.test(char)) {
// 			letter++;
// 		}
// 	}

// 	return { number, letter };
// }

// console.log(countNumberAndLetters('string152%\\¥'));

// TASK ZS
// function singleNumber(arr: number[]): number {
// 	return arr.find((num) => arr.indexOf(num) === arr.lastIndexOf(num))!;
// }

// console.log(singleNumber([4, 2, 1, 2, 1]));

// TASK ZT

// function firstUniqueCharIndex(str: string): number {
// 	const charCount: Record<string, number> = {};
// 	for (const char of str) {
// 		charCount[char] = (charCount[char] || 0) + 1;
// 	}
// 	for (let i = 0; i < str.length; i++) {
// 		if (charCount[str[i]] === 1) return i;
// 	}
// 	return -1;
// }

// console.log(firstUniqueCharIndex('stamp'));
// console.log(firstUniqueCharIndex('success'));

// TASK ZU

function sumOfUnique(nums: number[]): number {
	const countMap: Record<number, number> = {};

	for (const num of nums) {
		countMap[num] = (countMap[num] || 0) + 1;
	}

	let sum = 0;
	for (const num in countMap) {
		if (countMap[num] === 1) {
			sum += Number(num);
		}
	}

	return sum;
}

console.log(sumOfUnique([1, 2, 3, 2]));
console.log(sumOfUnique([1, 2, 3, 4]));

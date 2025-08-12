//Find the Greatest Common Divisor (GCD) of N Numbers

// Approach 1: first find the largest and smallest and then find gcd by running a loop only to smallest integer
// time complexity : O(n + min element)
// space complexity : O(1)
class Solution {
public:
    int find(int l,int s){
        int x=INT_MIN;
        for(int i=1;i<=s;++i){ // we can also run the loop backward as it will decrease the time complexity 
            if(s%i==0 && l%i==0) x=max(x,i); // because here we can straight away return 
        }return x;
    }
    int findGCD(vector<int>& nums) {
        int l=INT_MIN;
        int s=INT_MAX;
        for(int i=0;i<nums.size();++i){
            l=max(l,nums[i]);
            s=min(s,nums[i]);
        }
        return find(l,s);
    }
};
// approach 2 : by euclidean algorithm
// time complexity : O(n + log(maximum element))
// space complexity : O(1)

class Solution {
public:
    int find(int s,int l){
        if(s==0) return l;
        return find(l%s,s);
    }
    int findGCD(vector<int>& nums) {
        int l=INT_MIN;
        int s=INT_MAX;
        for(int i=0;i<nums.size();++i){
            l=max(l,nums[i]);
            s=min(s,nums[i]);
        }
        return find(s,l);
    }
};

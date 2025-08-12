// Deep Clone a Linked List with Random Pointer

#include <bits/stdc++.h>
using namespace std;

// Approach 1 : by creating a hash map for mapping Node pointers
// time complexity : O(n)
// space complexity : O(n)

/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = NULL;
        random = NULL;
    }
};
*/

class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(head==NULL) return NULL;
        Node* temp=head;
        map<Node*,Node*>mp;
        while(temp!=NULL){
            Node* newnode=new Node(temp->val);
            mp[temp]=newnode;
            temp=temp->next;
        }temp=head;
        
        while(temp!=NULL){
            Node* copy=mp[temp];
            copy->next=mp[temp->next];
            copy->random=mp[temp->random];
            temp=temp->next;
        }return mp[head];
    }
};

//Approach 2 : by linking all new nodes to old nodes (in their next attribute) then change their next and random 
// time complexity : O(3n)
// space complexity : O(1)


class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(head==NULL ) return head;
        Node* temp=head;
        while(temp!=NULL){
            Node* copy=new Node(temp->val);
            copy->next=temp->next;
            temp->next=copy;
            temp=temp->next->next;
        }
        temp=head;
        while(temp!=NULL){
            Node* copy=temp->next;
            if(temp->random) temp->next->random=temp->random->next;
            else copy->random=nullptr;
            temp=temp->next->next;
        }
        temp=head;
        Node* dummy=new Node(-1);
        Node* d=dummy;
        while(temp!=NULL){
            d->next=temp->next;
            temp->next=temp->next->next;
            d=d->next;
            temp=temp->next;
        }return dummy->next;
    }

};

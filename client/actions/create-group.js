"use server";

export default async function createGroup(groupName, phoneNumbers) {
  try {
    // Step 1: Get UIDs from phone numbers
    let phoneResponse = await fetch(`http://localhost:8000/auth/get-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(phoneNumbers),
    });
    let phoneData = await phoneResponse.json();
    if (!phoneData || phoneData.length === 0) {
      return { success: false, message: "No UIDs found for the provided phone numbers" };
    }

    const uids = phoneData.map((entry) => entry.uid);

    // Step 2: Create the group
    let groupResponse = await fetch(`http://localhost:8000/group/create-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupname: groupName, uids }),
    });
    let groupData = await groupResponse.json();
    if (!groupData.error) {
      return { success: true, message: "Group created successfully", group: groupData };
    }
    return { success: false, message: groupData.message };
  } catch (e) {
    console.error({ message: e.message });
    return { success: false, message: "An error occurred while creating the group" };
  }
}

package com.payanam.railconnect.model;

public enum BookingMode {
    EMERGENCY(1),
    CONNECTING(2),
    NORMAL(3);

    private final int priorityRank;

    BookingMode(int priorityRank) {
        this.priorityRank = priorityRank;
    }

    public int getPriorityRank() {
        return priorityRank;
    }
}
